import { Select } from "terraprisma";

export default function SelectPage() {
  return <article>
    <Select name="example select">
      <Select.Dropdown>
        <Select.Option value="first">First</Select.Option>
        <Select.Option value="second">Second</Select.Option>
        <Select.Option value="third">Third</Select.Option>
      </Select.Dropdown>
    </Select>
  </article>;
}
