describe('blockatnet UI Tests', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  describe('Header', () => {
    it('should have dark background', () => {
      cy.get('header').should('have.css', 'background-color', 'rgb(10, 10, 15)');
    });

    it('should be sticky at top', () => {
      cy.get('header').should('have.css', 'position', 'sticky');
    });

    it('should have logo', () => {
      cy.get('header img').first().should('be.visible');
    });

    it('should have navigation links', () => {
      cy.get('header nav').should('be.visible');
    });

    it('should have connect button', () => {
      cy.contains('Connect Wallet').should('be.visible');
    });
  });

  describe('Cards', () => {
    it('should have dark background', () => {
      cy.get('[class*="card"]').first().should('have.css', 'background-color', 'rgb(24, 24, 27)');
    });

    it('should have rounded corners', () => {
      cy.get('[class*="card"]').first().should('have.css', 'border-radius', '16px');
    });

    it('should have border', () => {
      cy.get('[class*="card"]').first().should('have.css', 'border-color', 'rgb(63, 63, 70)');
    });
  });

  describe('Buttons', () => {
    it('should have primary color', () => {
      cy.contains('Connect Wallet').should('have.css', 'background-color', 'rgb(167, 139, 250)');
    });

    it('should have rounded corners', () => {
      cy.contains('Connect Wallet').should('have.css', 'border-radius', '12px');
    });

    it('should have hover effect', () => {
      cy.contains('Connect Wallet').hover();
      cy.contains('Connect Wallet').should('have.css', 'background-color', 'rgb(249, 250, 251)');
    });
  });

  describe('Typography', () => {
    it('should use Inter font', () => {
      cy.get('body').should('have.css', 'font-family', 'Inter, system-ui, -apple-system, sans-serif');
    });

    it('should have primary text color', () => {
      cy.get('body').should('have.css', 'color', 'rgb(249, 250, 251)');
    });
  });

  describe('Responsive Design', () => {
    it('should be mobile friendly', () => {
      cy.viewport(390, 844);
      cy.get('header').should('be.visible');
      cy.contains('Connect Wallet').should('be.visible');
    });

    it('should be tablet friendly', () => {
      cy.viewport(768, 1024);
      cy.get('header').should('be.visible');
      cy.contains('Connect Wallet').should('be.visible');
    });

    it('should be desktop friendly', () => {
      cy.viewport(1440, 900);
      cy.get('header').should('be.visible');
      cy.contains('Connect Wallet').should('be.visible');
    });
  });

  describe('Dark Mode', () => {
    it('should default to dark mode', () => {
      cy.get('body').should('have.css', 'background-color', 'rgb(10, 10, 15)');
    });

    it('should toggle color mode', () => {
      cy.get('button[aria-label="Toggle color mode"]').click();
      // Add assertion for light mode if implemented
    });
  });

  describe('Navigation', () => {
    it('should navigate to different pages', () => {
      cy.contains('Home').click();
      cy.url().should('include', '/');

      cy.contains('Cryptocurrencies').click();
      cy.url().should('include', '/cryptocurrencies');
    });
  });

  describe('Loading States', () => {
    it('should show loading indicator', () => {
      cy.visit('/');
      cy.get('[class*="loading"]').should('be.visible');
    });
  });

  describe('Error Handling', () => {
    it('should handle API errors gracefully', () => {
      // Mock API failure
      cy.intercept('GET', '/api/*', { statusCode: 500 });
      cy.visit('/');
      // Add assertion for error state
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels', () => {
      cy.get('button').each(($btn) => {
        cy.wrap($btn).should('have.attr', 'aria-label');
      });
    });

    it('should be keyboard navigable', () => {
      cy.get('button').first().focus();
      cy.keyboard('tab');
      cy.focused().should('be.visible');
    });
  });

  describe('Performance', () => {
    it('should load within 3 seconds', () => {
      const start = Date.now();
      cy.visit('/');
      cy.then(() => {
        const loadTime = Date.now() - start;
        expect(loadTime).to.be.lessThan(3000);
      });
    });
  });
});
