// import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

// 호출 예시
/* <DialogModal
    placeholder="Edit Placeholder"
    title="Edit Profile"
    description="Make changes to your profile here. Click save when you're done."
    content={content}
    button="Save changes"
    buttonType="submit"
/> */

const DialogButton = (
    {
        placeholder = "Default Placeholder",
        title = "Default Title",
        description = "Default Description",
        content,
        button = "Forward error caused",
        buttonType,
        onClickChange
    } :
    {
        placeholder:string,
        title:string,
        description:string,
        content?:React.ReactNode,
        button:string
        buttonType: "button" | "submit" | "reset" | undefined,
        onClickChange?: () => void
    }
) => {
    // 아래와 같은 형태의 코드 내용을 상위 컴포넌트에서 정의 후, content 매개변수로 전달하여 사용할 수 있습니다.
    {/* const content = (
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-right">
            Name
          </Label>
          <Input id="name" defaultValue="Pedro Duarte" className="col-span-3" />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="username" className="text-right">
            Username
          </Label>
          <Input id="username" defaultValue="@peduarte" className="col-span-3" />
        </div>
      </div>
    ); */}

    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">{placeholder}</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>
              {description}
            </DialogDescription>
          </DialogHeader>
          {content}
          <DialogFooter>
            <Button type={buttonType} onClick={onClickChange}>{button}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
}

export default DialogButton;