import BaseTemplate from "@/templates/BaseTemplate";
import Loading from "./Loading";

export default function ScreenLoader() {
    return (
        <BaseTemplate>
          <div className="w-full h-full flex items-center justify-center">
            <Loading />
          </div>
        </BaseTemplate>
      );
}