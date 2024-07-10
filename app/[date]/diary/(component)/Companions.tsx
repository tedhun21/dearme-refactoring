export default function Companions({ label, register, watchValue }: any) {
  const isSelected = label === watchValue;

  return (
    <div className="px-1 py-2">
      <label
        htmlFor={label}
        className={`cursor-pointer rounded-lg border-2 border-default-400 bg-default-100 px-2 py-1 text-sm font-semibold xs:text-base ${
          isSelected
            ? "border-default-800 bg-default-800 text-default-100 hover:bg-default-700"
            : "text-default-800 hover:border-default-600 hover:bg-default-400"
        }`}
      >
        {label}
      </label>
      <input
        type="radio"
        id={label}
        value={label}
        {...register("companions")}
        hidden
      />
    </div>
  );
}
