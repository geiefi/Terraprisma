import { useLocation, useNavigate } from 'solid-start';

import { Box, List, ListItem, ListItemWithDetails } from '@terraprisma/general';
import { JSX } from 'solid-js';

function Link(props: { to: string; children: JSX.Element }) {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <ListItem
      role="link"
      class="!h-fit"
      onClick={() => navigate(props.to)}
      clickable
      active={location.pathname === props.to}
    >
      {props.children}
    </ListItem>
  );
}

export function Sidebar() {
  return (
    <Box class="w-full h-full flex flex-col gap-4">
      <List>
        <h1 class="text-lg text-[var(--muted-fg)] uppercase">
          getting started
        </h1>

        <Link to="/">overview</Link>
        <Link to="/installation">installation</Link>
      </List>

      <List>
        <h1 class="text-lg text-[var(--muted-fg)] uppercase">components</h1>

        <Link to="/components/button">button</Link>
        <Link to="/components/table">button</Link>
        <Link to="/components/button">button</Link>

        <ListItemWithDetails
          class="!h-fit"
          details={
            <List class="pl-3 bg-[var(--deeper-bg)] -mt-2">
              <Link to="/components/createForm">createForm()</Link>
              <Link to="/components/toggler">toggler</Link>
              <Link to="/components/checkbox">checkbox</Link>
              <Link to="/components/radiogroup">radio group</Link>
              <Link to="/components/input">input</Link>
              <Link to="/components/textarea">textarea</Link>
            </List>
          }
        >
          @terraprisma/forms
        </ListItemWithDetails>
      </List>
    </Box>
  );
}
