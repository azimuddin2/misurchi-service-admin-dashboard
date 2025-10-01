import EditSubscription from '../../_components/edit-subscription';

const EditSubscriptionPage = ({ params }: { params: { id: string } }) => {
  return (
    <div>
      <EditSubscription id={params.id} />
    </div>
  );
};

export default EditSubscriptionPage;
