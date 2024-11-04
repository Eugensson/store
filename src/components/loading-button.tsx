import { LoaderIcon } from "lucide-react";

import { Button, ButtonProps } from "@/components/ui/button";

import { cn } from "@/lib/utils";

interface LoadingButtonProps extends ButtonProps {
  loading: boolean;
}

export const LoadingButton = ({
  loading,
  disabled,
  className,
  ...props
}: LoadingButtonProps) => {
  return (
    <Button
      disabled={loading || disabled}
      className={cn("flex items-center gap-x-2", className)}
      {...props}
    >
      {loading && <LoaderIcon className="size-5 animate-spin" />}
      {props.children}
    </Button>
  );
};
