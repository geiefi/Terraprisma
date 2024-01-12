import { createEffect, createSignal, JSX } from 'solid-js';
import { useLocation, useNavigate } from '@solidjs/router';

import { Box, List, ListItem, ListItemWithDetails } from 'terraprisma';

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
        <List class="p-2 bg-[var(--deeper-bg-30)] rounded-md">
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
    <Box class="w-full h-full flex-grow flex flex-col gap-4">
      <List>
        {/* <h1 class="text-lg text-[var(--muted-fg)] uppercase"> */}
        {/*   getting started */}
        {/* </h1> */}

        <Link to="/overview">overview</Link>
        {/* <Link to="/installation">installation</Link> */}
      </List>

      <List>
        <div class="text-lg text-[var(--muted-fg)] uppercase">components</div>

        <CollapsedLinks
          basePath="/components/general"
          links={
            <>
              <Link to="/components/general/buttons">buttons</Link>
              <Link to="/components/general/ripple">ripple</Link>
              <Link to="/components/general/theme-provider">
                theme provider
              </Link>
              <Link to="/components/general/list">list</Link>
              <Link to="/components/general/dropdown">dropdown</Link>
              <Link to="/components/general/dialog">dialog</Link>
            </>
          }
        >
          general
        </CollapsedLinks>

        <CollapsedLinks
          basePath="/components/data-display"
          links={
            <>
              <Link to="/components/data-display/table">table</Link>
              <Link to="/components/data-display/tooltip">tooltip</Link>
            </>
          }
        >
          data-display
        </CollapsedLinks>

        <Link to="/components/icons">icons</Link>
        <Link to="/components/transitions">transitions</Link>

        <CollapsedLinks
          basePath="/components/navigation"
          links={
            <>
              <Link to="/components/navigation/pagination">pagination</Link>
              <Link to="/components/navigation/steps">steps</Link>
              <Link to="/components/navigation/menu">menu</Link>
            </>
          }
        >
          navigation
        </CollapsedLinks>
        <CollapsedLinks
          basePath="/components/forms"
          links={
            <>
              <Link to="/components/forms/createForm">createForm()</Link>
              <Link to="/components/forms/toggler">toggler</Link>
              <Link to="/components/forms/checkbox">checkbox</Link>
              <Link to="/components/forms/radio-group">radio group</Link>
              <Link to="/components/forms/input">input</Link>
              <Link to="/components/forms/textarea">textarea</Link>
            </>
          }
        >
          forms
        </CollapsedLinks>
      </List>

      <List>
        <div class="text-lg text-[var(--muted-fg)] uppercase">concepts</div>

        <Link to="/concepts/theming">theming</Link>
      </List>
    </Box>
  );
}
