import RequirementDetailsMain from "@/components/layout/main/RequirementDetailsMain";

const ParentRequirementDetails = ({ params }) => {
  return <RequirementDetailsMain id={params.id} />;
};

export default ParentRequirementDetails;