import {Choices} from './steps';
import {Ticket, tickets} from './tickets';

export interface Suggestion {
  title: string
  price: number;
  quantity: number;
}

function getTicketPrice(ticket: Ticket, hasDiscount: boolean): number {
  return hasDiscount ? ticket.reduced : ticket.price;
}

function getTicketTitle(ticket: Ticket, hasDiscount: boolean): string {
  return `${ticket.title}${hasDiscount ? ' reduced' : ''}`;
}

export function suggestTickets(choices: Choices): Suggestion[] {
  const days = parseInt(choices.time, 10);
  const hasDiscount = choices.hasDiscount === 'yes';
  if (choices.quantity === 'more') {
    let suggestedTicket: Ticket;
    if (choices.isRural === 'yes') {
      suggestedTicket = tickets.dayABC;
    } else {
      suggestedTicket = tickets.dayAB;
    }
    return [{
      title: getTicketTitle(suggestedTicket, hasDiscount),
      price: getTicketPrice(suggestedTicket, hasDiscount),
      quantity: 1
    }]
  } else {
    const tripsPerDay = parseInt(choices.quantity, 10);
    const totalTrips = tripsPerDay * days;
    const numberOfTrip4 = Math.floor(totalTrips / 4);
    const numberOfRegular = totalTrips % 4;
    let combination: { regular: Ticket, trip4: Ticket };
    if (choices.isShort === 'yes') {
      combination = {regular: tickets.short, trip4: tickets.short4};
    } else {
      if (choices.isRural === 'yes') {
        combination = {regular: tickets.singleABC, trip4: tickets.trip4ABC};
      } else {
        combination = {regular: tickets.singleAB, trip4: tickets.trip4AB};
      }
    }
    let suggestions: Suggestion[] = [];
    if (numberOfTrip4 > 0) {
      suggestions.push({
        title: getTicketTitle(combination.trip4, hasDiscount),
        price: getTicketPrice(combination.trip4, hasDiscount),
        quantity: numberOfTrip4
      });
    }
    if (numberOfRegular > 0) {
      suggestions.push({
        title: getTicketTitle(combination.regular, hasDiscount),
        price: getTicketPrice(combination.regular, hasDiscount),
        quantity: numberOfRegular
      });
    }
    return suggestions;
  }
}
