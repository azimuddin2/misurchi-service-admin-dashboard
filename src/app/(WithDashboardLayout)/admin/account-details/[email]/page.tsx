import VendorViewAccount from '../_components/vendor-view-account';

const ViewAccountPage = ({ params }: { params: { email: string } }) => {
  return (
    <div>
      <VendorViewAccount email={params.email} />
    </div>
  );
};

export default ViewAccountPage;
