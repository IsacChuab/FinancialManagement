import type { BillWithActions } from "@isac-chuab/financial-shared";
import BillForm from "./AddBill";
import DeleteBill from "./DeleteBill";
import CloseMonth from "./CloseMonth";

interface BillActionsModalsProps {
	type: 'add' | 'edit' | 'delete' | 'closeMonth';
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  activeBill?: BillWithActions;
}

const BillActionsModals = ({type, isOpen, setIsOpen, activeBill}: BillActionsModalsProps) => {
  return ( 
		<div>
			{(type === 'add' || type === 'edit') && (
				<BillForm
					isOpen={isOpen}
					closeModal={setIsOpen}
					billToEdit={activeBill}
				/>
			)}

			{type === 'delete' && activeBill && (
				<DeleteBill
					isOpen={isOpen}
					setModalIsOpen={setIsOpen}
					bill={activeBill}
				/>
			)}

			{type === 'closeMonth' && (
				<CloseMonth
					isOpen={isOpen}
					setModalIsOpen={setIsOpen}
				/>
			)}
		</div>
	);
};

export default BillActionsModals;