describe('Images API', () => {
  const endpoint = '/images';
  const imageItem = {
    name: 'my-image',
    key: '172s732s',
    mimetype: 'image/jpeg',
    size: 3000,
    width: 1000,
    height: 1000,
  };

  const createImage = (body) =>
    cy.request({
      method: 'POST',
      url: endpoint,
      body,
      headers: {
        accept: 'application/json',
      },
      failOnStatusCode: false,
    });

  const updateImage = (id, body) =>
    cy.request({
      method: 'PATCH',
      url: endpoint.concat('/', id),
      body,
      headers: {
        accept: 'application/json',
      },
      failOnStatusCode: false,
    });

  describe(`POST ${endpoint}`, () => {
    it('When adding a new valid image, Then should get back a 201 response', () => {
      createImage(imageItem).then((response) => {
        expect(response.status).to.eq(201);
        expect(response.body).to.deep.include(imageItem);
      });
    });

    it('When adding an image without specifying name, get back 400 response', () => {
      const { name, ...newImage } = imageItem;
      createImage(newImage).then((response) => {
        expect(response.status).to.eq(400);
        expect(response.body.validation.body.message).to.eq('"name" is required');
      });
    });
  });

  describe(`PATCH ${endpoint}/:id`, () => {
    it('When updating an image with valid data, get back 204 response', () => {
      createImage(imageItem)
        .then((response) => {
          const body = { ...imageItem, name: 'my-new-name' };
          return updateImage(response.body._id, body);
        })
        .then((response) => {
          expect(response.status).to.eq(204);
        });
    });

    it('When providing an invalid image id, get back 400 response', () => {
      updateImage('null', imageItem).then((response) => {
        expect(response.status).to.eq(400);
      });
    });
  });

  describe(`DELETE ${endpoint}/:id`, () => {
    it('When deleting an image with valid id, get back 204 response', () => {
      createImage(imageItem)
        .then((response) => {
          return cy.request({
            method: 'DELETE',
            url: `${endpoint}/${response.body._id}`,
            headers: {
              accept: 'application/json',
            },
          });
        })
        .then((response) => {
          expect(response.status).to.eq(204);
        });
    });

    it('When providing an invalid image id, get back 400 response', () => {
      cy.request({
        method: 'DELETE',
        url: `${endpoint}/null`,
        headers: {
          accept: 'application/json',
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(400);
      });
    });
  });
});
