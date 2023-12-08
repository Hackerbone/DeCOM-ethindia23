import { Input } from "antd";
import React from "react";
import { CloseCircleFilled, SearchOutlined } from "@ant-design/icons";
import styles from "styles/components/Search.module.scss";
import PropTypes from "prop-types";

const SearchBar = (props) => {


  return (
    <Input
      {...props}
      ref={props.searchRef}
      placeholder={props.placeholder || "Search"}
      className={`${styles.darkBugBaseSearchbar} ${props.className || ""}`}
      prefix={
        <SearchOutlined
          className={`${styles.searchIcon} site-form-item-icon `}
        />
      }
      defaultValue={props.defaultValue}
      onChange={props.onChange}
      allowClear={props.allowClear ? { clearIcon: <CloseCircleFilled className={styles.clearIcon} onClick={props.onClear} /> } : false}

    />
  );
};

SearchBar.propTypes = {
  placeholder: PropTypes.string,
};

export default SearchBar;
