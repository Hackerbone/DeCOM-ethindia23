import { Steps } from 'antd';
import React from 'react'
import styles from "styles/pages/CreateStore.module.scss";
import OnboardingStep1 from 'components/createStoreOnboarding/Step1';
import DashboardLayout from 'components/DashboardLayout';
import OnboardingStep4 from 'components/createStoreOnboarding/Step4';


const steps = [{}, {}];

const CreateStore = () => {
    const [currentStep, setCurrentStep] = React.useState(1)


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
                        <OnboardingStep1 currentStep={currentStep} setCurrentStep={setCurrentStep} />
                    ) : currentStep === 1 ? <OnboardingStep4 /> : null }
                </div>
            </div>
        </DashboardLayout>

    )
}

export default CreateStore