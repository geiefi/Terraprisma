import { createEffect, createSignal, JSX } from 'solid-js';
import { useLocation, useNavigate } from '@solidjs/router';

import { Box, List, ListItem, ListItemWithDetails } from 'terraprisma';

function ListItemLink(props: { to: string; children: JSX.Element }) {
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

function CollapsedLinks(props: {
  basePath: string;
  links: JSX.Element;
  children: JSX.Element;
}) {
  const location = useLocation();

  const [showingLinks, setShowingLinks] = createSignal(
    // eslint-disable-next-line
    location.pathname.startsWith(props.basePath)
  );

  createEffect(() => {
    if (location.pathname.startsWith(props.basePath)) {
      setShowingLinks(true);
    }
  });

  return (
    <ListItemWithDetails
      class="!h-fit"
      showingDetails={showingLinks()}
      onClick={() => setShowingLinks((v) => !v)}
      details={
        <List class="p-2 bg-deeper-bg/30 rounded-md">
          {props.links}
        </List>
      }
    >
      {props.children}
    </ListItemWithDetails>
  );
}

export function Sidebar() {
  return (
    <Box class="w-full h-full overflow-y-auto flex-grow flex flex-col gap-4">
      <List>
        {/* <h1 class="text-lg text-[var(--muted-fg)] uppercase"> */}
        {/*   getting started */}
        {/* </h1> */}

        <ListItemLink to="/">overview</ListItemLink>
        {/* <Link to="/installation">installation</Link> */}
      </List>

      <List>
        <div class="text-lg text-muted-fg uppercase">components</div>

        <CollapsedLinks
          basePath="/components/general"
          links={
            <>
              <ListItemLink to="/components/general/buttons">
                buttons
              </ListItemLink>
              <ListItemLink to="/components/general/ripple">
                ripple
              </ListItemLink>
              <ListItemLink to="/components/general/theme-provider">
                theme provider
              </ListItemLink>
              <ListItemLink to="/components/general/list">list</ListItemLink>
              <ListItemLink to="/components/general/popover">
                popover
              </ListItemLink>
              <ListItemLink to="/components/general/dialog">
                dialog
              </ListItemLink>
            </>
          }
        >
          general
        </CollapsedLinks>

        <CollapsedLinks
          basePath="/components/data-display"
          links={
            <>
              <ListItemLink to="/components/data-display/table">
                table
              </ListItemLink>
              <ListItemLink to="/components/data-display/tooltip">
                tooltip
              </ListItemLink>
            </>
          }
        >
          data-display
        </CollapsedLinks>

        <ListItemLink to="/components/icons">icons</ListItemLink>
        <ListItemLink to="/components/transitions">transitions</ListItemLink>

        <CollapsedLinks
          basePath="/components/navigation"
          links={
            <>
              <ListItemLink to="/components/navigation/pagination">
                pagination
              </ListItemLink>
              <ListItemLink to="/components/navigation/steps">
                steps
              </ListItemLink>
              <ListItemLink to="/components/navigation/menu">menu</ListItemLink>
            </>
          }
        >
          navigation
        </CollapsedLinks>
        <CollapsedLinks
          basePath="/components/forms"
          links={
            <>
              <ListItemLink to="/components/forms/createForm">
                createForm()
              </ListItemLink>
              <ListItemLink to="/components/forms/toggler">
                toggler
              </ListItemLink>
              <ListItemLink to="/components/forms/checkbox">
                checkbox
              </ListItemLink>
              <ListItemLink to="/components/forms/select">
                select
              </ListItemLink>
              <ListItemLink to="/components/forms/datepicker">
                datepicker
              </ListItemLink>
              <ListItemLink to="/components/forms/radio-group">
                radio group
              </ListItemLink>
              <ListItemLink to="/components/forms/input">input</ListItemLink>
              <ListItemLink to="/components/forms/textarea">
                textarea
              </ListItemLink>
            </>
          }
        >
          forms
        </CollapsedLinks>
      </List>

      <List>
        <div class="text-lg text-muted-fg uppercase">concepts</div>

        <ListItemLink to="/concepts/theming">theming</ListItemLink>
      </List>
    </Box>
  );
}
