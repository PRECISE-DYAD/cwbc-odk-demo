abstract class OdkCommonClass {
  abstract getFileAsUrl(relativePath: string): string;
  abstract getProperty(propertyId: string): string;
}

export default OdkCommonClass;
