import { Steps, message } from "antd";
import React from "react";
import styles from "styles/pages/CreateStore.module.scss";
import OnboardingStep1, { isValidUrl } from "components/createStoreOnboarding/Step1";
import DashboardLayout from "components/DashboardLayout";
import OnboardingStep4 from "components/createStoreOnboarding/Step4";
import OnboardingStep2 from "components/createStoreOnboarding/Step2";
import { createVendorContract } from "services/vendorfactory.service";
import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { setStoreId, setUserType } from "store/user.slice";

const steps = [{}, {}, {}];

const CreateStore = () => {
  const [currentStep, setCurrentStep] = React.useState(0);
  const dispatch = useDispatch();
  const [brandDetails, setBrandDetails] = React.useState({
    name: "",
    logo: "",
  });

  const createVendorMutation = useMutation({
    mutationFn: createVendorContract,
    onSuccess: (vendorAddress) => {
      message.success("Store created successfully");
      dispatch(setUserType("vendor"));
      dispatch(setStoreId(vendorAddress));
      setCurrentStep(2);
    },
    onError: (err) => {
      console.log(err);
      message.error("Some error occured while creating store!");
    },
  });

  const createVendor = async (values) => {
    const { wantsKYC } = values;
    const { name, logo } = brandDetails;

    if (!name || !logo) {
      message.error("Please fill all details!");
      return;
    }
    if (!isValidUrl(logo)) {
      message.error("Enter a valid logo url!");
      return;
    }

    await createVendorMutation.mutateAsync({ name, logo, wantsKYC });
  };

  const handleStep1 = async (values) => {
    const { name, logo } = values;

    if (!name || !logo) {
      message.error("Please fill all details!");
      return;
    }
    if (!isValidUrl(logo)) {
      message.error("Enter a valid logo url!");
      return;
    }

    setBrandDetails({ name, logo });
    setCurrentStep(1);

  }

  return (
    <DashboardLayout hideSidebar>
      <div className={styles.onboardingContainer}>
        <div className={styles.onboardingFormContainer}>
          <Steps
            current={currentStep}
            items={steps}
            className={styles.onboardingSteps}
          />
          {currentStep === 0 ? (
            <OnboardingStep1
              handleStep1={handleStep1}

              currentStep={currentStep}
              setCurrentStep={setCurrentStep}
            />
          ) : currentStep === 1 ? (
            <OnboardingStep2 createVendor={createVendor} loading={createVendorMutation.isLoading} />
          ) : currentStep === 2 ? (
            <OnboardingStep4 />
          ) : null
          }
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CreateStore;
