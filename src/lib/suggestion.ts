import {Answers} from './questions';
import {Ticket, tickets} from './tickets';

export interface Suggestion {
  title: string
  price: number;
  quantity: number;
}

function getTicketPrice(ticket: Ticket, hasDiscount: boolean): number {
  return hasDiscount && ticket.reduced ? ticket.reduced : ticket.price;
}

function getTicketTitle(ticket: Ticket, hasDiscount: boolean): string {
  return `${ticket.title}${hasDiscount && ticket.reduced ? ' reduced' : ''}`;
}

function findBestApproach(approaches: Suggestion[][]): Suggestion[] {
  const reducer = (total: number, {price, quantity}: Suggestion) => total + price * quantity;
  approaches.sort((a, b) => {
    const aTotal = a.reduce(reducer, 0);
    const bTotal = b.reduce(reducer, 0);
    return aTotal - bTotal;
  });
  return approaches.shift()!;
}

export function suggestTickets(answers: Answers): Suggestion[] {
  const days = parseInt(answers.time!, 10);
  const people = parseInt(answers.people!, 10);
  const hasDiscount = answers.hasDiscount === 'yes';
  let approaches: Suggestion[][] = [];

  // day tickets approach
  const suggestedTicket = answers.isRural === 'yes' ? tickets.dayABC : tickets.dayAB;
  approaches.push([{
    title: getTicketTitle(suggestedTicket, hasDiscount),
    price: getTicketPrice(suggestedTicket, hasDiscount),
    quantity: days * people
  }]);

  // regular tickets approach
  if (answers.quantity !== 'more') {
    const tripsPerDay = parseInt(answers.quantity!, 10);
    const totalTrips = tripsPerDay * days * people;
    const numberOfTrips4 = Math.floor(totalTrips / 4);
    const numberOfSingleTrips = totalTrips % 4;
    let combination: { single: Ticket, trip4: Ticket };
    if (answers.isShort === 'yes') {
      combination = {single: tickets.short, trip4: tickets.short4};
    } else {
      if (answers.isRural === 'yes') {
        combination = {single: tickets.singleABC, trip4: tickets.trip4ABC};
      } else {
        combination = {single: tickets.singleAB, trip4: tickets.trip4AB};
      }
    }
    let regularApproach: Suggestion[] = [];
    if (numberOfTrips4 > 0) {
      regularApproach.push({
        title: getTicketTitle(combination.trip4, hasDiscount),
        price: getTicketPrice(combination.trip4, hasDiscount),
        quantity: numberOfTrips4
      });
    }
    if (numberOfSingleTrips > 0) {
      regularApproach.push({
        title: getTicketTitle(combination.single, hasDiscount),
        price: getTicketPrice(combination.single, hasDiscount),
        quantity: numberOfSingleTrips
      });
    }
    approaches.push(regularApproach);
  }

  // group tickets approach
  if (people > 1) {
    const suggestedTicket = answers.isRural === 'yes' ? tickets.dayGroupABC : tickets.dayGroupAB;
    approaches.push([{
      title: getTicketTitle(suggestedTicket, hasDiscount),
      price: getTicketPrice(suggestedTicket, hasDiscount),
      quantity: days
    }]);
  }

  return findBestApproach(approaches);
}
