import { A } from 'solid-start';

export default function NotFound() {
  return (
    <div class="py-10 grid place-items-center">
      <div class="my-0 text-[15rem]">\\(o_o)/</div>
      <h1 class="my-0 text-4xl font-roboto-mono">
        This wasn't added quite yet.
      </h1>
      <p class="text-2xl flex gap-4">couldn't find what you were looking</p>
      <span class="text-[var(--muted-fg)]">
        You could also try opening an issue{' '}
        <A href="https://github.com/gabrielmfern/Terraprisma">here</A>?
      </span>
    </div>
  );
}
