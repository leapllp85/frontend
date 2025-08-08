import { Select, Portal } from '@chakra-ui/react'

export const SelectOptions = ({ className, frameworks, label, value, onValueChange }: any) => {
    return (
        <Select.Root
            collection={frameworks}
            onValueChange={onValueChange}
            value={value}
            className={className}
        >
            <Select.HiddenSelect />
            <Select.Label>{label}</Select.Label>
            <Select.Control>
                <Select.Trigger>
                    <Select.ValueText placeholder={`Select ${label}`} />
                </Select.Trigger>
                <Select.IndicatorGroup>
                    <Select.Indicator />
                </Select.IndicatorGroup>
            </Select.Control>
            <Portal>
                <Select.Positioner>
                    <Select.Content>
                        {frameworks.map((framework: any) => (
                            <Select.Item item={framework} key={framework.value}>
                                {framework.label}
                                <Select.ItemIndicator />
                            </Select.Item>
                        ))}
                    </Select.Content>
                </Select.Positioner>
            </Portal>
        </Select.Root>
    )
}