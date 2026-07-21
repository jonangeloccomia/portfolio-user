"use client";

import { useEditor, useNode, type UserComponent } from "@craftjs/core";

import { cn } from "@/lib/utils";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export type VideoProps = {
  videoId: string;
  aspectRatio: "16:9" | "1:1" | "4:3";
};

const ASPECT_PADDING: Record<VideoProps["aspectRatio"], string> = {
  "16:9": "56.25%",
  "1:1": "100%",
  "4:3": "75%",
};

export const Video: UserComponent<Partial<VideoProps>> = ({
  videoId = "u31qwQUeGuM",
  aspectRatio = "16:9",
}) => {
  const {
    connectors: { connect },
  } = useNode();
  const { enabled } = useEditor((state) => ({ enabled: state.options.enabled }));

  return (
    <div
      ref={(ref) => {
        if (ref) connect(ref);
      }}
      className="relative w-full"
      style={{ paddingBottom: ASPECT_PADDING[aspectRatio] }}
    >
      <iframe
        className={cn("absolute inset-0 size-full rounded-md", enabled && "pointer-events-none")}
        src={`https://www.youtube-nocookie.com/embed/${videoId}`}
        title="Embedded video"
        allowFullScreen
      />
    </div>
  );
};

function VideoSettings() {
  const {
    videoId,
    aspectRatio,
    actions: { setProp },
  } = useNode((node) => ({
    videoId: node.data.props.videoId,
    aspectRatio: node.data.props.aspectRatio,
  }));

  return (
    <>
      <Field>
        <FieldLabel htmlFor="video-id">YouTube video ID</FieldLabel>
        <Input
          id="video-id"
          value={videoId}
          onChange={(event) =>
            setProp((props: VideoProps) => {
              props.videoId = event.target.value;
            })
          }
        />
      </Field>
      <Field>
        <FieldLabel>Aspect ratio</FieldLabel>
        <RadioGroup
          value={aspectRatio}
          onValueChange={(value) =>
            setProp((props: VideoProps) => {
              props.aspectRatio = value as VideoProps["aspectRatio"];
            })
          }
          className="flex gap-4"
        >
          {(["16:9", "1:1", "4:3"] as const).map((option) => (
            <div key={option} className="flex items-center gap-1.5">
              <RadioGroupItem value={option} id={`aspect-${option}`} />
              <Label htmlFor={`aspect-${option}`}>{option}</Label>
            </div>
          ))}
        </RadioGroup>
      </Field>
    </>
  );
}

Video.craft = {
  displayName: "Video",
  props: { videoId: "u31qwQUeGuM", aspectRatio: "16:9" },
  related: { settings: VideoSettings },
};
