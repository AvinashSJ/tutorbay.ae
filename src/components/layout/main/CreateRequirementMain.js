import CreateRequirementForm from "@/components/sections/create-requirement/CreateRequirementPrimary";
import HeroPrimary from "@/components/sections/hero-banners/HeroPrimary";
import React from "react";

const CreateRequirementMain = () => {
  return (
    <>
      <HeroPrimary path={"Create Requirement"} title={"Create Course Requirement"} />
      <CreateRequirementForm />
    </>
  );
};

export default CreateRequirementMain;
