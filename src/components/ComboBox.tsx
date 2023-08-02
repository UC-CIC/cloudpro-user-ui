import { forwardRef, useCallback, useEffect, useState } from 'react';
import { useCombobox } from 'downshift';
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import {
  Box,
  Flex,
  Input,
  InputGroup,
  InputRightElement,
  List,
  ListIcon,
  ListItem,
  useMergeRefs,
} from '@chakra-ui/react';

type Props = {
  disabled?: boolean;
  onChange?: (value: any) => any;
  options?: { label: string; value: string }[];
  placeholder?: string;
};

const ComboBox = forwardRef<typeof Input, Props>(
  ({ disabled, onChange, options = [], placeholder }, ref) => {
    const [items, setItems] = useState(options);
    const stateReducer = useCallback((state: any, actionAndChanges: any) => {
      const { type, changes } = actionAndChanges;
      switch (type) {
        case useCombobox.stateChangeTypes.ItemClick:
        case useCombobox.stateChangeTypes.InputKeyDownEnter:
        case useCombobox.stateChangeTypes.InputBlur:
          return {
            ...changes,
            ...(changes.selectedItem && {
              inputValue: changes.selectedItem.label,
            }),
          };
        default:
          return changes; // otherwise business as usual.
      }
    }, []);

    const {
      getInputProps,
      getItemProps,
      getMenuProps,
      getToggleButtonProps,
      highlightedIndex,
      isOpen,
      reset,
      selectedItem,
    } = useCombobox({
      itemToString: (item) => (item ? item.label : ''),
      items,
      onInputValueChange: ({ inputValue }) => {
        setItems(
          options.filter((item) =>
            item.label.toLowerCase().includes((inputValue || '').toLowerCase()),
          ),
        );
      },
      onSelectedItemChange: ({ selectedItem }) => {
        onChange && onChange(selectedItem);
      },
      stateReducer,
    });

    const { ref: downshiftInputRef, ...inputProps } = getInputProps({
      disabled,
    }) as any;
    const inputRef = useMergeRefs(downshiftInputRef, ref);

    useEffect(() => {
      reset();
      setItems(options);
    }, [reset, options]);

    return (
      <Flex direction="column" flex="1 1 auto">
        <InputGroup>
          {/* Searchbox */}
          <ComboboxInput
            {...inputProps}
            ref={inputRef}
            variant="outline"
            placeholder={placeholder}
          />

          {/* Toggle button */}
          <InputRightElement
            {...getToggleButtonProps({ disabled })}
            aria-label={'toggle menu'}
          >
            {isOpen ? (
              <ChevronUpIcon boxSize="5" />
            ) : (
              <ChevronDownIcon boxSize="5" />
            )}
          </InputRightElement>
        </InputGroup>
        <Box>
          <ComboboxList isOpen={isOpen} {...getMenuProps({ disabled })}>
            {items.map((item, index) => {
              const isSelected = item.value === selectedItem?.value;
              return (
                <ComboboxItem
                  {...getItemProps({ item, index })}
                  isActive={isSelected || index === highlightedIndex}
                  isSelected={isSelected}
                  key={item.value}
                >
                  {item.label}
                </ComboboxItem>
              );
            })}
          </ComboboxList>
        </Box>
      </Flex>
    );
  },
);

const ComboboxInput = forwardRef(({ ...props }: any, ref: any) => {
  return <Input bg="white" {...props} ref={ref} />;
});

const ComboboxList = forwardRef(({ isOpen, ...props }: any, ref: any) => {
  return (
    <Box
      position="absolute"
      display={isOpen ? '' : 'none'}
      zIndex="dropdown"
      left={0}
      right={0}
      flex={1}
      mt={1}
      py={0}
      overflowY="auto"
      borderWidth="1px"
      borderRadius="md"
      borderColor="gray.200"
      boxShadow="md"
      textAlign="left"
    >
      <List {...props} ref={ref} />
    </Box>
  );
});

const ComboboxItem = forwardRef(
  ({ children, isActive, isSelected, ...props }: any, ref: any) => {
    return (
      <ListItem
        cursor="pointer"
        display="flex"
        flex="1 1 auto"
        alignItems="center"
        pr={4}
        py={2}
        bg={isActive ? 'teal.400' : 'white'}
        color={isActive ? 'white' : 'gray.700'}
        transition="background-color 220ms, color 220ms"
        {...props}
        ref={ref}
      >
        <Box display="flex" alignItems="center" boxSize="4" ml="3" mr="3">
          {isSelected && (
            <ListIcon
              as={CheckIcon}
              boxSize="3"
              color={isActive ? 'white' : 'gray.300'}
            />
          )}
        </Box>
        {children}
      </ListItem>
    );
  },
);

export default ComboBox;
