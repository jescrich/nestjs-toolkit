import { Urn } from '@this/repository/models/urn';

describe('URN', () => {
  it('should return entity name', async () => {
    // Arrange
    const urn = 'urn:oms:orders:1234';

    // Act
    const result = Urn.entity(urn);

    // Assert
    expect(result).toBe('orders');
  });

  it('should return entity id', async () => {
    // Arrange
    const urn = 'urn:oms:orders:1234';

    // Act
    const result = Urn.id(urn);

    // Assert
    expect(result).toBe('1234');
  });

  it('should return system name', async () => {
    // Arrange
    const urn = 'urn:oms:orders:1234';

    // Act
    const result = Urn.system(urn);

    // Assert
    expect(result).toBe('oms');
  });

  it('should return any other value in a complex urn', async () => {
    // Arrange
    const urn = 'urn:oms:orders:1234:vendorCode:abcd';

    // Act
    const result = Urn.key(urn, 'vendorCode');

    // Assert
    expect(result).toBe('abcd');
  });

  it('should return product code based on a product urn', async () => {
    const urn = 'urn:oms:product:65b2713b1267994147953b27:vendor:first-close-one:sku:ALC_Property Report2';

    const result = Urn.key(urn, 'sku');

    expect(result).toBe('ALC_Property Report2');
  });
});
