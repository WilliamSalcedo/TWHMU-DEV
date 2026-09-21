-- TWHMU — expand tour_dates with real PDP (product detail page) info,
-- and reseed with 6 real events, Oct 2026 – Jan 2027, 50 tickets each.
-- Venues/addresses are real, well-known venues (used as the fictional show's
-- tour stops). Headliner/description content is invented for this demo.

alter table public.tour_dates
  add column if not exists venue_address text,
  add column if not exists event_time text,
  add column if not exists price numeric(10, 2) not null default 0,
  add column if not exists capacity int not null default 50,
  add column if not exists tickets_sold int not null default 0,
  add column if not exists headliner text,
  add column if not exists description text,
  add column if not exists age_restriction text not null default 'All Ages';

-- Wipe the old placeholder dates (June–August 2026, already in the past) and
-- replace with the real Oct 2026 – Jan 2027 schedule.
delete from public.tour_dates;

insert into public.tour_dates (
  event_date, city, venue, venue_address, event_time, price, capacity, tickets_sold,
  headliner, description, age_restriction,
  tag_label, tag_variant, action_label, action_href, action_variant, sold_out, sort_order
) values
  (
    '2026-10-03', 'New York, NY', 'Brooklyn Steel', '319 Frost St, Brooklyn, NY 11222',
    'Doors 7:00 PM · Show 8:00 PM', 95.00, 50, 44,
    'The Women Who Made Us — Full Company',
    'Opening night of the tour. The full company performs the complete two-act tribute, plus a surprise guest set from vocalist Dara Ellison.',
    'All Ages',
    'Few Left', 'coral', 'Tickets ›', '#', 'btn', false, 1
  ),
  (
    '2026-10-24', 'Boston, MA', 'House of Blues Boston', '15 Lansdowne St, Boston, MA 02215',
    'Doors 7:00 PM · Show 8:00 PM', 65.00, 50, 12,
    'The Women Who Made Us — Full Company',
    'The Boston stop features an extended acoustic interlude and a guest appearance by saxophonist Reyna Voss.',
    'All Ages',
    'On Sale', 'default', 'Tickets ›', '#', 'btn', false, 2
  ),
  (
    '2026-11-07', 'Philadelphia, PA', 'The Fillmore Philadelphia', '29 E Allen St, Philadelphia, PA 19123',
    'Doors 7:00 PM · Show 8:00 PM', 65.00, 50, 20,
    'The Women Who Made Us — Full Company',
    'Philadelphia''s show includes the tour''s only string-quartet arrangement of the Act II finale.',
    'All Ages',
    'On Sale', 'default', 'Tickets ›', '#', 'btn', false, 3
  ),
  (
    '2026-11-21', 'Washington, DC', 'The Anthem', '901 Wharf St SW, Washington, DC 20024',
    'Doors 7:00 PM · Show 8:00 PM', 75.00, 50, 50,
    'The Women Who Made Us — Full Company',
    'This stop sold out in 48 hours. Join the waitlist to be notified if tickets become available.',
    'All Ages',
    'Sold Out', 'muted', 'Join waitlist', '#', 'link', true, 4
  ),
  (
    '2026-12-12', 'Nashville, TN', 'Ryman Auditorium', '116 Rep. John Lewis Way N, Nashville, TN 37219',
    'Doors 6:30 PM · Show 7:30 PM', 85.00, 50, 46,
    'The Women Who Made Us — Full Company',
    'A once-in-a-tour stop at the legendary Ryman Auditorium, with a stripped-down "in the round" staging exclusive to this venue.',
    'All Ages',
    'Few Left', 'coral', 'Tickets ›', '#', 'btn', false, 5
  ),
  (
    '2027-01-16', 'Los Angeles, CA', 'The Wiltern', '3790 Wilshire Blvd, Los Angeles, CA 90010',
    'Doors 7:00 PM · Show 8:00 PM', 120.00, 50, 6,
    'The Women Who Made Us — Full Company (Tour Closer)',
    'Tour closer at The Wiltern. Early access for signed-in members only until general on-sale opens.',
    'All Ages',
    'Pre-Sale · Members', 'aqua', 'Sign in to access', '#', 'link', false, 6
  )
on conflict (event_date, city) do nothing;
