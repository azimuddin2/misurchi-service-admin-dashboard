import VendorReferralDetail from '../_components/vendor-referral-detail';

const VendorReferralDetailPage = async ({
  params,
}: {
  params: Promise<{ vendorId: string }>;
}) => {
  const vendorId = (await params).vendorId;

  return (
    <div>
      <VendorReferralDetail vendorId={vendorId} />
    </div>
  );
};

export default VendorReferralDetailPage;
