import VendorViewAccount from '../_components/vendor-view-account';

const ViewAccountPage = async ({
  params,
}: {
  params: Promise<{ email: string }>;
}) => {
  const userEmail = (await params).email;

  return (
    <div>
      <VendorViewAccount email={userEmail} />
    </div>
  );
};

export default ViewAccountPage;
