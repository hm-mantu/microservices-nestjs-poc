function logData(message:string): ClassDecorator {
    console.log(`Message is: ${message}`)
    return function (): void {
        console.log('constructor')
    }
}

function logProperty(message:string): PropertyDecorator {
    console.log(`[Property 🟡] Message is: ${message}`)
    return function (): void {        
        console.log('[Property 🟡] constructor')
    }
}


function logMethod(message: string): MethodDecorator {
    console.log(`[Method 🟠] Message is: ${message}`)
    return function (): void {
        console.log('[Method 🟠] constructor')
    }
}

function logParameter(message: string): ParameterDecorator {
    console.log(`[Parameter 🔵] Message is: ${message}`)
    return function (): void {
        console.log('[Parameter 🔵] constructor')
    }
}

function AddProperty<T>(name: string, value:T) :ClassDecorator {
    console.log('Adding property');
    return function (target: any) : void{
        target.prototype[name] = value;

        const instance = new target() as User;
        instance.firstName = "Mantu";
        instance.lastName = "Pani"
        console.log(instance);
    }
}

@logData("User")
@AddProperty<boolean>('isActive', false)
class User {
    @logProperty("firstname")
    public firstName: string;
    public lastName: string;


    constructor(firstName: string, lastName: string) {
        this.firstName = firstName;
        this.lastName = lastName;
    }

    @logMethod("Method Decorator")
    public getFullName(@logParameter("Parameter") text: string) {
        return `${text}, ${this.firstName} ${this.lastName}`;
    }
}

const user = new User('John', 'Doe');
// @ts-ignore
console.log(user.getFullName("Hello "), (user as User & { isActive: boolean }).isActive)
