import { useTheme } from "next-themes";
import Select from "react-select";

const customStyles = (
  padding: string,
  backgroundColor: string,
  borderRadius: string,
  border: string,
  theme: string | undefined
) => ({
  control: (provided: any, state: any) => ({
    ...provided,
    width: "100%",
    borderShadow: "none",
    textAlign: "left",
    backgroundColor:
      theme === "dark"
        ? "transparent"
        : state.isDisabled
          ? "#f1f5f9"
          : backgroundColor,
    padding,
    borderRadius,
    border,
    fontSize: "14px",
    borderColor: state.isFocused
      ? "transparent"
      : theme === "dark"
        ? "#ccd5e1"
        : provided.borderColor,
    boxShadow: state.isFocused ? "0 0 0 1px #16a34a" : "none",
  }),
  singleValue: (provided: any, state: any) => ({
    ...provided,
    color: state.isDisabled && theme !== "dark"
      ? "black"
      : theme === "dark"
        ? "#ccd5e1"
        : provided.color,
  }),
  option: (provided: any, state: any) => ({
    ...provided,
    color: state.isSelected ? "black" : "grey",
    backgroundColor: state.isSelected
      ? "#ECF1F7"
      : state.isFocused
        ? "#ECF1F7"
        : theme === "dark"
          ? "#1f2937"
          : "white",
    fontSize: "14px",
    lineHeight: "20px",
  }),
  placeholder: (provided: any) => ({
    ...provided,
    color: "#94A3B8",
  }),
});

export default function ReactSelect({
  options,
  placeholder,
  onChange,
  value,
  padding = "10px",
  backgroundColor = "#ffffff",
  borderRadius = "none",
  border = "1px solid #cbd5e1",
  isDisabled = false,
}: any) {
  const { theme } = useTheme();
  return (
    <Select
      options={options}
      styles={customStyles(padding, backgroundColor, borderRadius, border, theme)}
      onChange={(option) => {
        onChange(option);
      }}
      placeholder={placeholder}
      value={value}
      isDisabled={isDisabled}
    />
  );
}
