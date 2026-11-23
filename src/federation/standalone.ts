void import('./mount')
  .then(({ mount }) => {
    const container = document.getElementById('remote-root');
    if (!container) throw new Error('Missing remote-root container.');
    return mount(container);
  })
  .catch((error: unknown) => {
    console.error('Book library mount failed', error);
    document.body.textContent = 'Could not start the book library.';
  });
