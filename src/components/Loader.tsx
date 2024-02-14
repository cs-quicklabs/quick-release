interface LoaderProps {
  color?: string;
  width?: string;
}

const Loader = ({ width, color }: LoaderProps) => {
  return (
    <div
      className={`${width} h-6 rounded-full animate-spin border-2 border-solid ${color} border-t-transparent`}
    ></div>
  );
};

export default Loader;
