interface CommandPropertiesInterface{
    readonly name: string
    readonly description: string
    readonly options: Array<string> | null
    readonly aliases: Array<string>
}
