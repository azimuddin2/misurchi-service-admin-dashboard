import ViewAccount from '../_components/view-account';

const ViewAccountPage = ({ params }: { params: { email: string } }) => {
  return (
    <div>
      <ViewAccount email={params.email} />
    </div>
  );
};

export default ViewAccountPage;
