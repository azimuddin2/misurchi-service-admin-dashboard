import ViewAccount from '../_components/view-account';

const ViewAccountPage = ({ params }: { params: { id: string } }) => {
  return (
    <div>
      <ViewAccount userId={params.id} />
    </div>
  );
};

export default ViewAccountPage;
