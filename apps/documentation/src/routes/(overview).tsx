export default function Home() {
  return (
    <article>
      <h1>Overview</h1>

      <p>
        A <code>type-safe</code> flexible UI library that takes DX to the next
        level.
      </p>

      <p>
        Terraprisma is not just another UI library, it tries to improve on
        various key points of discomfort that other UI libraries (of all
        frameworks) have and tries to take the DX to the next level.
      </p>

      <h2>The principles</h2>

      <p>
        What really makes the DX great, is the principles that are used to guide
        the development of Terraprisma.
      </p>

      <h3>Type-safety, because peace of mind matters to us</h3>

      <p>On Terraprisma, you should not have to worry about things like:</p>

      <ul>
        <li>using validators that should not be used on a certail field,</li>
        <li>
          types in the value of a Form not matching the field in the actual
          markup like trying to associate a type=number input to a field that is
          supposed to be a string.
        </li>
        <li>
          when a component needs to have a color that is based on the defined
          theme the allowed colors are communicated globally through special
          types so that you have type-safety on your theme colors as well.
        </li>
      </ul>

      <h3>Flexbility that feels like HTML</h3>

      <p>
        While Terraprisma is not going to provide the same flexbility as
        something like shadcn, (which I think we will soon also have with
        Solid), you can still have flexbility that can take you really far on
        the spectrum of changes you can make.
      </p>

      <p>Two of the ways this is currently manifested are:</p>

      <ul>
        <li>
          Always forwarding the main element's props to the component's props so
          you can set anything like the normal element
        </li>
        <li>
          Keep in mind this means you won't really be able to easily change
          properties of elements that are still of the component but that are
          wrapping the element somehow
        </li>
        <li>
          Always trying to make components as composable as possible, with
          littles pieces, like lego, you can put together to make the resulting
          UX
        </li>
      </ul>

      <h3>Error traceability even when you don't have source maps</h3>

      <p>
        We are going to always try to take the error messages so that they are
        as informative and as good as possible for you to be able to debug
        errors even if you don't have source maps and the code running in
        production is not minified and uglified.
      </p>

      <p>
        One of the ways this is manifested is with the identification prop. All
        components that may error, will, for the most part, require an
        identification prop that will be used in the error messages so it makes
        it much easier for you to narrow down what is the problem, or where it
        is coming from once you have them.
      </p>
    </article>
  );
}
