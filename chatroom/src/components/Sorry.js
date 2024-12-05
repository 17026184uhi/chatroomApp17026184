function Sorry() {
  return (
    <div style={{ textAlign: "center" }}>
      <h1 style={{ textDecoration: "double underline" }}>SORRY</h1>
      <h3>When installing a package, always do the following:</h3>
      <h4>1. Stop the application.</h4>
      <h4>
        2. Install from the same folder that you run the application from.
      </h4>
      <h4>
        3. Check the package.json at the highest directory, ignore the inner
        one.
      </h4>
    </div>
  );
}

export default Sorry;
