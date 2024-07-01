export default function Companions({ label, register, getValue }: any) {
  const isSelected = label === getValue;

  return (
    <div>
      <label
        htmlFor={label}
        className={`cursor-pointer rounded-lg border-2 border-default-400 bg-default-100 px-2 py-1 font-semibold ${
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
