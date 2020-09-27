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
  return `${ticket.title}${hasDiscount ? ' reduced' : ''}`;
}

export function suggestTickets(answers: Answers): Suggestion[] {
  const days = parseInt(answers.time!, 10);
  const hasDiscount = answers.hasDiscount === 'yes';
  if (answers.quantity === 'more') {
    let suggestedTicket: Ticket;
    if (answers.isGroup === 'yes') {
      suggestedTicket = answers.isRural === 'yes' ? tickets.dayGroupABC : tickets.dayGroupAB;
    } else {
      suggestedTicket = answers.isRural === 'yes' ? tickets.dayABC : tickets.dayAB;
    }
    return [{
      title: getTicketTitle(suggestedTicket, hasDiscount),
      price: getTicketPrice(suggestedTicket, hasDiscount),
      quantity: days
    }]
  } else {
    const tripsPerDay = parseInt(answers.quantity!, 10);
    const totalTrips = tripsPerDay * days;
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
    let suggestions: Suggestion[] = [];
    if (numberOfTrips4 > 0) {
      suggestions.push({
        title: getTicketTitle(combination.trip4, hasDiscount),
        price: getTicketPrice(combination.trip4, hasDiscount),
        quantity: numberOfTrips4
      });
    }
    if (numberOfSingleTrips > 0) {
      suggestions.push({
        title: getTicketTitle(combination.single, hasDiscount),
        price: getTicketPrice(combination.single, hasDiscount),
        quantity: numberOfSingleTrips
      });
    }
    return suggestions;
  }
}
