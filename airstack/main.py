from dotenv import load_dotenv
import os
import asyncio
import requests
from PIL import Image, ImageDraw, ImageFont
from io import BytesIO
from airstack.execute_query import AirstackClient

load_dotenv()

api_key = os.environ.get("AIRSTACK_API_KEY")
if api_key is None:
    raise Exception("Please set the AIRSTACK_API_KEY environment variable")
api_client = AirstackClient(api_key=api_key)


def generate_query(owner_address):
    query_template = """
    query MyQuery {{
      Ethereum: TokenBalances(
        input: {{filter: {{owner: {{_eq: "{owner}"}}, tokenType: {{_in: [ERC1155, ERC721]}}}}, blockchain: ethereum, limit: 100}}
      ) {{
        TokenBalance {{
          tokenNfts {{
            contentValue {{
              image {{
                small
              }}
            }}
          }}
        }}
      }}
    }}
    """
    return query_template.format(owner=owner_address)


async def download_image(url):
    if url[-4:] != ".png":
        return None
    response = requests.get(url)
    print("Downloading image from " + url)
    if response.status_code == 200:
        return Image.open(BytesIO(response.content))
    else:
        return None


async def main():
    owner_address = "dhruva.eth"
    query = generate_query(owner_address=owner_address)
    execute_query_client = api_client.create_execute_query_object(query=query)
    query_response = await execute_query_client.execute_query()
    data = query_response.data
    error = query_response.error
    if query_response.error is not None:
        raise Exception(error.message)

    x_dimension, y_dimension = 5, 3

    tokens = data["Ethereum"]["TokenBalance"]
    images = []
    counter = 0
    for token in tokens:
        if token["tokenNfts"] is not None and token["tokenNfts"]["contentValue"] is not None and token["tokenNfts"]["contentValue"]["image"] is not None and token["tokenNfts"]["contentValue"]["image"]["small"] is not None:
            img = await download_image(token["tokenNfts"]["contentValue"]["image"]["small"])
            if img is not None:
                # some images are the same, hash them to avoid duplicates
                if len(images) != 0 and img.tobytes() == images[-1].tobytes():
                    continue
                images.append(img)
                counter += 1
                if counter > x_dimension * y_dimension:
                    break

    # Create a new image for the collage
    width, height = images[0].size
    collage = Image.new('RGB', (width * x_dimension, height * y_dimension))

    # Paste images
    for i, image in enumerate(images[:x_dimension * y_dimension]):
        x = i % x_dimension * width
        y = i // x_dimension * height
        collage.paste(image, (x, y))

    # Add text
    draw = ImageDraw.Draw(collage)
    font = ImageFont.truetype("./Arial_Bold.ttf", 80)
    text = f"2023 wrapped {owner_address}"
    textwidth, textheight = draw.textsize(text, font=font)
    text_x = (collage.width - textwidth) / 2
    text_y = (collage.height - textheight) / 2
    draw.rectangle([text_x - 10, text_y - 10, text_x +
                   textwidth + 10, text_y + textheight + 10], fill="white")
    draw.text((text_x, text_y), text, fill="black", font=font)

    # Save the image
    collage.save("vitalik_eth_collage.png")

if __name__ == '__main__':
    asyncio.run(main())
