import { A, useLocation } from 'solid-start';

import { Box, List, ListItem } from '@terraprisma/general';
import { JSX } from 'solid-js';

function ArticleLink(props: { link: string; children: JSX.Element }) {
  const location = useLocation();

  return (
    <A class="w-full h-max decoration-none" href={props.link}>
      <ListItem clickable active={location.pathname === props.link}>
        {props.children}
      </ListItem>
    </A>
  );
}

export function Sidebar() {
  return (
    <Box class="w-full h-full flex flex-col gap-4">
      <List>
        <h1 class="text-lg text-[var(--muted-fg)] uppercase">
          getting started
        </h1>

        <ArticleLink link="/">overview</ArticleLink>
        <ArticleLink link="/installation">installation</ArticleLink>
      </List>

      <List>
        <h1 class="text-lg text-[var(--muted-fg)] uppercase">components</h1>

        <ArticleLink link="/components/button">button</ArticleLink>
        <ArticleLink link="/components/table">button</ArticleLink>
        <ArticleLink link="/components/button">button</ArticleLink>

        <h2 class="text-base text-[var(--muted-fg)] uppercase">forms</h2>

        <ArticleLink link="/components/form">form</ArticleLink>
        <ArticleLink link="/components/toggler">toggler</ArticleLink>
        <ArticleLink link="/components/checkbox">checkbox</ArticleLink>
        <ArticleLink link="/components/radiogroup">radio group</ArticleLink>
        <ArticleLink link="/components/input">input</ArticleLink>
        <ArticleLink link="/components/textarea">textarea</ArticleLink>
      </List>
    </Box>
  );
}
