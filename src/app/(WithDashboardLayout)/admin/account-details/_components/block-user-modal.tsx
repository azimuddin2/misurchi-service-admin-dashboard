import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { IUser } from '@/types';

interface BlockModalProps {
  user: IUser | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (user: IUser) => void;
}

const BlockUserModal = ({
  user,
  isOpen,
  onOpenChange,
  onConfirm,
}: BlockModalProps) => {
  if (!user) return null;

  const isBlocked = user.status === 'blocked';

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-xl p-6">
        <DialogHeader>
          <DialogTitle
            className={`text-lg font-medium ${isBlocked ? 'text-green-600' : 'text-red-600'}`}
          >
            {isBlocked ? 'Unblock User' : 'Block User'}
          </DialogTitle>
          <DialogDescription>
            {isBlocked
              ? `Are you sure you want to unblock ${user.fullName}?`
              : `Are you sure you want to block ${user.fullName}? This action will restrict their access.`}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            className={
              isBlocked
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : 'bg-red-600 hover:bg-red-700 text-white'
            }
            onClick={() => {
              onConfirm(user);
              onOpenChange(false);
            }}
          >
            {isBlocked ? 'Confirm Unblock' : 'Confirm Block'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BlockUserModal;
