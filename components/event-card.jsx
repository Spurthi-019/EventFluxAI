"use client";

import { Calendar, MapPin, Users, Trash2, Eye } from "lucide-react";
import { format } from "date-fns";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const CATEGORY_ICONS = {
  tech: "💻",
  music: "🎵",
  sports: "⚽",
  art: "🎨",
  food: "🍽️",
  business: "💼",
  health: "🏥",
  networking: "👥",
};

const CATEGORY_LABELS = {
  tech: "Technology",
  music: "Music",
  sports: "Sports",
  art: "Art",
  food: "Food",
  business: "Business",
  health: "Health",
  networking: "Networking",
};

export default function EventCard({
  event,
  onClick,
  onDelete,
  variant = "grid",
  className = "",
}) {
  if (variant === "list") {
    return (
      <Card
        className={`py-0 group cursor-pointer hover:shadow-lg transition-all hover:border-purple-500/50 ${className}`}
        onClick={onClick}
      >
        <CardContent className="p-3 flex gap-3">
          {/* Event Image */}
          <div className="w-20 h-20 rounded-lg shrink-0 overflow-hidden relative">
            {event.coverImage ? (
              <Image
                src={event.coverImage}
                alt={event.title}
                fill
                className="object-cover"
              />
            ) : (
              <div
                className="absolute inset-0 flex items-center justify-center text-3xl"
                style={{ backgroundColor: event.themeColor }}
              >
                {CATEGORY_ICONS[event.category]}
              </div>
            )}
          </div>

          {/* Event Info */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold truncate">{event.title}</h3>
            <p className="text-sm text-muted-foreground line-clamp-1">
              {event.description}
            </p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {format(event.startDate, "MMM dd")}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {event.location}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-1">
            <Button
              size="sm"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                onClick?.();
              }}
            >
              <Eye className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                onDelete?.();
              }}
              className="text-red-500 hover:text-red-600"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Grid variant (default)
  return (
    <Card
      className={`group cursor-pointer overflow-hidden hover:shadow-lg transition-all hover:border-purple-500/50 ${className}`}
      onClick={onClick}
    >
      {/* Image */}
      <div className="relative h-40 overflow-hidden bg-gradient-to-br">
        {event.coverImage ? (
          <Image
            src={event.coverImage}
            alt={event.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform"
          />
        ) : (
          <div
            className="absolute inset-0 flex items-center justify-center text-5xl"
            style={{ backgroundColor: event.themeColor }}
          >
            {CATEGORY_ICONS[event.category]}
          </div>
        )}
      </div>

      {/* Content */}
      <CardContent className="p-4">
        {/* Category Badge */}
        <Badge variant="secondary" className="mb-2 text-xs">
          {CATEGORY_ICONS[event.category]} {CATEGORY_LABELS[event.category]}
        </Badge>

        {/* Title */}
        <h3 className="font-semibold line-clamp-2 mb-2">{event.title}</h3>

        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {event.description}
        </p>

        {/* Meta Info */}
        <div className="space-y-2 text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>{format(event.startDate, "MMM dd, yyyy")}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span className="truncate">{event.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span>
              {event.registrationCount || 0}/{event.capacity} registered
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2 border-t">
          <Button
            size="sm"
            variant="outline"
            className="flex-1 gap-2"
            onClick={(e) => {
              e.stopPropagation();
              onClick?.();
            }}
          >
            <Eye className="w-4 h-4" />
            View
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="flex-1 gap-2 text-red-500 hover:text-red-600"
            onClick={(e) => {
              e.stopPropagation();
              onDelete?.();
            }}
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
