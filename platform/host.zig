// This ia a modified version of https://github.com/roc-lang/roc/blob/main/examples/platform-switching/web-assembly-platform/host.zig

const std = @import("std");
const str = @import("str");
const list = @import("list");
const builtin = @import("builtin");
const RocStr = str.RocStr;
const RocList = list.RocList;

const Align = extern struct { a: usize, b: usize };
extern fn malloc(size: usize) callconv(.C) ?*align(@alignOf(Align)) anyopaque;
extern fn realloc(c_ptr: [*]align(@alignOf(Align)) u8, size: usize) callconv(.C) ?*anyopaque;
extern fn free(c_ptr: [*]align(@alignOf(Align)) u8) callconv(.C) void;
extern fn memcpy(dest: *anyopaque, src: *anyopaque, count: usize) *anyopaque;

export fn roc_alloc(size: usize, alignment: u32) callconv(.C) ?*anyopaque {
    _ = alignment;

    return malloc(size);
}

export fn roc_realloc(c_ptr: *anyopaque, new_size: usize, old_size: usize, alignment: u32) callconv(.C) ?*anyopaque {
    _ = old_size;
    _ = alignment;

    return realloc(@alignCast(@alignOf(Align), @ptrCast([*]u8, c_ptr)), new_size);
}

export fn roc_dealloc(c_ptr: *anyopaque, alignment: u32) callconv(.C) void {
    _ = alignment;

    free(@alignCast(@alignOf(Align), @ptrCast([*]u8, c_ptr)));
}

export fn roc_memcpy(dest: *anyopaque, src: *anyopaque, count: usize) callconv(.C) void {
    _ = memcpy(dest, src, count);
}

extern fn roc__mainForHost_1_exposed([*]u8) void;

extern fn js_render(framebuffer: [*]u8, width: f64, height: f64) void;

pub fn main() u8 {
    var callResult = RocList.empty();
    roc__mainForHost_1_exposed(&callResult);

    js_render(callResult.elements[0..100], 10, 10);

    return 0;
}
