import Loading from "./Loading";
import BaseTemplate from "@/templates/BaseTemplate";

export default function ScreenLoader() {
    return (
        <BaseTemplate>
          <div className="w-full h-full flex items-center justify-center">
            <Loading />
          </div>
        </BaseTemplate>
      );
}