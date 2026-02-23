import type { BillWithActions } from "@isac-chuab/financial-shared";
import BillForm from "./AddBill";
import DeleteBill from "./DeleteBill";
import CloseMonth from "./CloseMonth";

interface BillActionsModalsProps {
	type: 'add' | 'edit' | 'delete' | 'closeMonth';
  isOpen: boolean;
  handleClose: () => void;
  activeBill?: BillWithActions;
}

const BillActionsModals = ({type, isOpen, handleClose, activeBill}: BillActionsModalsProps) => {
  return (
		<div>
			{(type === 'add' || type === 'edit') && (
				<BillForm
					isOpen={isOpen}
					closeModal={handleClose}
					billToEdit={activeBill}
				/>
			)}

			{type === 'delete' && activeBill && (
				<DeleteBill
					isOpen={isOpen}
					closeModal={handleClose}
					bill={activeBill}
				/>
			)}

			{type === 'closeMonth' && (
				<CloseMonth
					isOpen={isOpen}
					closeModal={handleClose}
				/>
			)}
		</div>
	);
};

export default BillActionsModals;