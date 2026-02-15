"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronRight } from "lucide-react"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/animate-ui/primitives/radix/collapsible"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar"

export function NavMain({
  items
}) {
  const pathname = usePathname()
  const [openItems, setOpenItems] = React.useState({})

  // Auto-expand if active child
  React.useEffect(() => {
    items.forEach(item => {
      if (item.items) {
        const hasActiveChild = item.items.some(sub => pathname === sub.url || (sub.url !== '#' && sub.url !== '/admin' && pathname.startsWith(sub.url + '/')));
        if (hasActiveChild) {
          setOpenItems(prev => ({ ...prev, [item.title]: true }))
        }
      }
    })
  }, [pathname, items])

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {items.map((item) => {
            const isChildActive = item.items?.some(sub => sub.url === '/admin' ? pathname === '/admin' : (pathname === sub.url || (sub.url !== '#' && pathname.startsWith(sub.url + '/'))));
            const isActive = (item.url === '/admin' ? pathname === '/admin' : (pathname === item.url || (item.url !== '#' && pathname.startsWith(item.url + '/'))));
            const isOpen = openItems[item.title]

            if (item.items && item.items.length > 0) {
              return (
                <Collapsible
                  key={item.title}
                  asChild
                  defaultOpen={isOpen}
                  open={isOpen}
                  onOpenChange={(isOpen) => setOpenItems(prev => ({ ...prev, [item.title]: isOpen }))}
                  className="group/collapsible"
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton
                        tooltip={item.title}
                        isActive={isActive} // Check if any child is active
                        className="w-full justify-between"
                      >
                        <div className="flex items-center gap-2">
                          {item.icon && <item.icon />}
                          <span>{item.title}</span>
                        </div>
                        <ChevronRight
                          className="ml-auto transition-transform duration-300 group-data-[state=open]/collapsible:rotate-90"
                        />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>

                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items.map(subItem => (
                          <SidebarMenuSubItem key={subItem.url}>
                            <SidebarMenuSubButton asChild isActive={pathname === subItem.url || (subItem.url !== '#' && subItem.url !== '/admin' && pathname.startsWith(subItem.url + '/'))}>
                              <Link href={subItem.url}>
                                {subItem.title}
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              )
            }

            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  tooltip={item.title}
                  isActive={pathname === item.url || (item.url !== '#' && item.url !== '/admin' && pathname.startsWith(item.url + '/'))}
                  asChild
                >
                  <Link href={item.url}>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
