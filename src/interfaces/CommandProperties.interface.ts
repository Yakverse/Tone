export interface CommandPropertiesInterface{
    readonly name: string
    readonly description: string
    readonly options?: Array<any>
    readonly aliases: Array<string>
}
