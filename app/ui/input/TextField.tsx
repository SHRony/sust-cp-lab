import React, { FC, useState } from 'react'
export interface TextFieldProps {
  label: string
  errorMessage?: string
  value: string
  type ?: string
  onChange: (e:React.ChangeEvent<HTMLInputElement>) => void
}

const TextField: FC<TextFieldProps> = ({
  label,
  errorMessage,
  value,
  type,
  onChange,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isEmpty, setIsEmpty] = useState(true);
  return (
    <Wrapper>
      <Label isFocused={isFocused} isEmpty={isEmpty}>{label}</Label>
      <input
        type={type ?? 'text'}
        value={value}
        onChange={(e) => {
          onChange(e)
          if(e.target.value == '') setIsEmpty(true)
          else setIsEmpty(false)
        }}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="border-0 border-b border-gray-300 focus:border-gray-500 outline-none w-full bg-transparent z-10"
      />
      {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
    </Wrapper>
  )
}

const Wrapper = ({children}: {children: React.ReactNode}) => {
  return <div className="flex flex-col relative w-full p-4">
    {children}
  </div>
}

// const Label = styled.label<{ isFocused: boolean }>`
//   position: absolute;
//   top: ${({ isFocused }) => (isFocused ? '-10px' : '5px')};
//   left: 0;
//   font-size: ${({ isFocused }) => (isFocused ? '12px' : '16px')};
//   transition: all 0.2s ease-out;
// `
const Label = ({children, isFocused, isEmpty}: {children: React.ReactNode, isFocused: boolean, isEmpty: boolean}) => {
  return <label  className={`absolute ${(!isEmpty)||isFocused ? 'top-[-12px]' : 'top-[5px]'} left-4 ${(!isEmpty)||isFocused ? 'text-[14px]' : 'text-[16px]'} transition-all ease-out` }>{children}</label>
}
const ErrorMessage = ({children}: {children: React.ReactNode}) => {
  return <p className="text-red-500 text-sm mt-2">{children}</p>
}

export default TextField
