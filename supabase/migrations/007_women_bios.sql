alter table public.women add column if not exists bio text;

update public.women set bio = 'One of the best-selling music artists of all time, Whitney''s vocal power redefined pop and R&B balladry throughout the late ''80s and ''90s.' where name = 'Whitney';
update public.women set bio = 'A pioneering voice in late-''90s R&B and hip-hop soul, Aaliyah''s understated delivery and forward-thinking sound influenced a generation of artists.' where name = 'Aaliyah';
update public.women set bio = 'As part of the Fugees and later as a solo artist, Lauryn Hill fused hip-hop, soul, and reggae into some of the most influential records of the ''90s.' where name = 'Lauryn';
update public.women set bio = 'Known for her five-octave vocal range, Mariah Carey became one of the defining voices of ''90s pop and R&B.' where name = 'Mariah';
update public.women set bio = 'A trailblazer in pop, R&B, and dance music, Janet Jackson''s work throughout the ''80s and ''90s shaped the sound of a generation.' where name = 'Janet';
update public.women set bio = 'Fronting the band that bears her name, Sade''s smooth, sophisticated sound made her one of the most enduring voices in soul music.' where name = 'Sade';
update public.women set bio = 'With her deep, sultry contralto, Toni Braxton became one of the defining R&B voices of the 1990s.' where name = 'Toni';
update public.women set bio = 'The "Queen of Rock ''n'' Roll," Tina Turner''s decades-long career and explosive live performances made her a legend across generations.' where name = 'Tina';
update public.women set bio = 'Known as the "Queen of Tejano Music," Selena Quintanilla broke barriers for Latin artists in the U.S. before her career was cut short.' where name = 'Selena';

insert into public.women (name, role, bio, sort_order) values
  ('Donna Summer', 'Disco · 70s', 'Crowned the "Queen of Disco," Donna Summer''s string of hits in the 1970s helped define an entire era of dance music.', 10),
  ('Diana Ross', 'Soul · legend', 'As the face of The Supremes and later a solo star, Diana Ross became one of the defining voices of Motown and American pop.', 11),
  ('Madonna', 'Pop · 80s', 'Dubbed the "Queen of Pop," Madonna''s reinventions throughout the 1980s reshaped what a pop star could be.', 12),
  ('Anita Baker', 'Soul · 80s', 'With her rich contralto and jazz-inflected phrasing, Anita Baker helped define the sound of 1980s quiet storm R&B.', 13),
  ('Gloria Estefan', 'Latin · 80s', 'As the voice of Miami Sound Machine and a solo artist, Gloria Estefan brought Latin rhythms into the mainstream throughout the ''80s and ''90s.', 14),
  ('Mary J. Blige', 'R&B · 90s', 'Known as the "Queen of Hip-Hop Soul," Mary J. Blige fused R&B and hip-hop into a raw, confessional sound that defined 1990s soul music.', 15)
on conflict (name) do nothing;
