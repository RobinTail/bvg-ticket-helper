export interface Ticket {
  title: string;
  price: number;
  reduced?: number;
}

const ticketCodes = {
  short: true,
  singleAB: true,
  singleABC: true,
  trip4AB: true,
  trip4ABC: true,
  short4: true,
  dayAB: true,
  dayABC: true,
  dayGroupAB: true,
  dayGroupABC: true
};

type TicketCode = keyof typeof ticketCodes;

export const tickets: {[K in TicketCode]: Ticket} = {
  short: {
    title: 'Short-trip ticket',
    price: 1.90,
    reduced: 1.40
  },
  singleAB: {
    title: 'Single ticket AB',
    price: 2.90,
    reduced: 1.80
  },
  singleABC: {
    title: 'Single ticket ABC',
    price: 3.60,
    reduced: 2.60
  },
  trip4AB: {
    title: '4-trip ticket AB',
    price: 9.00,
    reduced: 5.60
  },
  trip4ABC: {
    title: '4-trip ticket ABC',
    price: 13.20,
    reduced: 9.60
  },
  short4: {
    title: '4-short-trip ticket',
    price: 5.60,
    reduced: 4.40
  },
  dayAB: {
    title: 'Day ticket AB',
    price: 8.60,
    reduced: 5.50
  },
  dayABC: {
    title: 'Day ticket ABC',
    price: 9.60,
    reduced: 6.00
  },
  dayGroupAB: {
    title: 'Small group day ticket AB',
    price: 23.50
  },
  dayGroupABC: {
    title: 'Small group day ticket ABC',
    price: 24.90
  }
};
