export class Provider {
  private constructor() {
  }

  private static provider: Provider;
  private instances: InstanceType[] = [];

  public static getDefaultProvider(): Provider {
    if (!Provider.provider) {
      Provider.provider = new Provider();
    }
    return Provider.provider;
  }

  register<T>(name: Symbol, TClass: { new(): T }) {
    const t = new TClass();
    if (this.instances.findIndex(x => x.name.toString() == name.toString()) <= 0) {
      this.instances.push(new InstanceType(name, t));
    }
  }

  get<T>(name: Symbol): T {
    if (!this.instances) return undefined;
    const instanceType = this.instances.find(x => x.name.toString() == name.toString());
    return instanceType ? instanceType.instance : undefined;
  }
}

class InstanceType {
  name: Symbol;
  instance: any;

  constructor(name: Symbol, instance: any) {
    this.name = name;
    this.instance = instance;
  }
}
