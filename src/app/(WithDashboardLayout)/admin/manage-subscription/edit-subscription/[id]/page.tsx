import EditSubscription from '../../_components/edit-subscription';

const EditSubscriptionPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const subscriptionID = (await params).id;

  return (
    <div>
      <EditSubscription id={subscriptionID} />
    </div>
  );
};

export default EditSubscriptionPage;
