"use client";

import { ListWithCards } from "@/types";
import { ListForm } from "./list-form";
import { useEffect, useState } from "react";
import { ListItem } from "./list-item";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import { useAction } from "@/hooks/useAction";
import { updateListOrder } from "@/actions/update-list-order";
import { toast } from "sonner";
import { updateCardOrder } from "@/actions/update-card-order";

interface ListContainerProps {
	data: ListWithCards[];
	boardId: string;
}

function reorder<T>(list: T[], startIndex: number, endIndex: number) {
	const result = Array.from(list);
	const [removed] = result.splice(startIndex, 1);
	result.splice(endIndex, 0, removed);

	return result;
}

export const ListContainer = ({ boardId, data }: ListContainerProps) => {
	const [orderedData, setOrderedData] = useState(data);

	const { execute: executeUpdateListOrder } = useAction(updateListOrder, {
		onSuccess: () => {
			toast.success("List reordered.");
		},
		onError: (error) => toast.error(error),
	});

	const { execute: executeUpdateCardOrder } = useAction(updateCardOrder, {
		onSuccess: () => {
			toast.success("Card reordered.");
		},
		onError: (error) => toast.error(error),
	});

	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setOrderedData(data);
	}, [data]);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	if (!isMounted) {
		return null;
	}

	const onDragEnd = (result: any) => {
		const { destination, source, type } = result;
		if (!destination) return;

		//if dropped in the same position
		if (destination.droppableId === source.droppableId && destination.index === source.index) {
			return;
		}

		//user moves a list
		if (type === "list") {
			const items = reorder(orderedData, source.index, destination.index).map((item, index) => ({
				...item,
				order: index,
			}));

			setOrderedData(items);

			//trigger server action
			executeUpdateListOrder({ items, boardId });
		}

		if (type === "card") {
			let newOrderedData = [...orderedData];

			//source and destination list
			const sourceList = newOrderedData.find((list) => list.id === source.droppableId);
			const desList = newOrderedData.find((list) => list.id === destination.droppableId);

			if (!sourceList || !desList) return;

			// check if cards exists on the sourceList
			if (!sourceList.cards) {
				sourceList.cards = [];
			}

			//check if cards exists on the desList
			if (!desList.cards) {
				desList.cards = [];
			}

			//moving the card in the same list
			if (source.droppableId === destination.droppableId) {
				const reorderedCards = reorder(sourceList.cards, source.index, destination.index);

				reorderedCards.forEach((card, index) => {
					card.order = index;
				});

				sourceList.cards = reorderedCards;
				setOrderedData(newOrderedData);

				// trigger server action
				executeUpdateCardOrder({ boardId, items: reorderedCards });
			} else {
				//user moves the card to another list

				const [movedCard] = sourceList.cards.splice(source.index, 1);

				//assign the new listid to the moved card
				movedCard.listId = destination.droppableId;

				//add card to the destination list
				desList.cards.splice(destination.index, 0, movedCard);
				sourceList.cards.forEach((card, index) => {
					card.order = index;
				});

				//update the order for each card in the destination list
				desList.cards.forEach((card, index) => {
					card.order = index;
				});

				setOrderedData(newOrderedData);
				//trigger server action
				executeUpdateCardOrder({ boardId, items: desList.cards });
			}
		}
	};

	return (
		<DragDropContext onDragEnd={onDragEnd}>
			<Droppable droppableId="lists" type="list" direction="horizontal">
				{(provided) => (
					<ol {...provided.droppableProps} ref={provided.innerRef} className="flex gap-x-3 h-full">
						{orderedData.map((list, index) => {
							return <ListItem key={list.id} index={index} data={list} />;
						})}
						{provided.placeholder}
						<ListForm />
						<div className="flex-shrink-0 w-1" />
					</ol>
				)}
			</Droppable>
		</DragDropContext>
	);
};
